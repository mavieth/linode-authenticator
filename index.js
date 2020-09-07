'use strict';

import {getKubeConfig, getKubernetesClusters, setToken} from "@linode/api-v4";
import {Base64} from "js-base64";
import * as fs from 'fs';
import * as path from 'path';

import {issueCommand} from "@actions/core/lib/command";

const core = require('@actions/core');
const k8s = require('@kubernetes/client-node');

async function fetchKubeConfig(token, clusterName) {
	setToken(token);
	core.setSecret(token);
	let clusters = [];
	try {
		clusters = await getKubernetesClusters();

	} catch (e) {
		core.setFailed(e.message);
		return -1;
	}
	let kubeConfigString = '';
	if (clusters.data.length > 1 && clusterName === null) {
		core.setFailed("A CLUSTER_NAME is required when >1 cluster is available.");
		return -1;
	}
	for (const cluster of clusters.data) {
		const kubeConfigResponseEncoded = await getKubeConfig(cluster.id);
		core.setSecret(kubeConfigResponseEncoded.kubeconfig);
		kubeConfigString = Base64.decode(kubeConfigResponseEncoded.kubeconfig);
		core.setSecret(kubeConfigString);
		const kc = new k8s.KubeConfig();
		kc.loadFromString(kubeConfigString);
		if (clusterName !== null) {
			let selectedCluster = kc.getCluster(clusterName);
			if (selectedCluster !== null && selectedCluster.name === clusterName || clusters.data.length === 1) {
				return kubeConfigString;
			}
		} else {
			return kubeConfigString;
		}
	}
	return kubeConfigString;
}

const run = async function () {
	try {
		const token = core.getInput('LINODE_TOKEN');
		const clusterName = core.getInput('CLUSTER_NAME');
		const kubeConfigPath = path.join(process.env['RUNNER_TEMP'], `kubeconfig_${Date.now()}`);
		core.debug(`Writing kubeconfig contents to ${kubeConfigPath}`);
		const kubeConfigData = await fetchKubeConfig(token, clusterName);
		fs.writeFileSync(kubeConfigPath, kubeConfigData);
		core.setOutput('KUBE_CONFIG',kubeConfigPath);
		core.setOutput('KUBE_CONFIG_DATA',kubeConfigData);
		// issueCommand('set-env', {name: 'KUBE_CONFIG'}, kubeConfigPath);
		issueCommand('set-env', {name: 'KUBE_CONFIG'}, kubeConfig);
		issueCommand('set-env', {name: 'KUBE_CONFIG_DATA'}, kubeConfigData);
		return kubeConfigPath;
	} catch (error) {
		console.log(error);
		return -1;
	}
};

run().then(res => {
	core.info(`Finished with result: ${res}`)
});
