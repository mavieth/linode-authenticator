# linode-authenticator ![linode-authenticator](https://github.com/mavieth/linode-authenticator/workflows/Test%20Linode%20Authenticator/badge.svg?branch=master)

> Authenticate with Linode kubernetes clusters.

## Inputs
It takes a `LINODE_CLI` token as an input. Create an API token on Linode [here](https://cloud.linode.com/profile/tokens).

## Example Usage

Without a cluster name (requires that you only have one cluster in your Linode account)

```yml
- name: get linode kubernetes config
  uses: mavieth/linode-authenticator@master
  with:
    LINODE_TOKEN: ${{ secrets.LINODE_TOKEN }}
```

With a cluster name

```yml
- name: get linode kubernetes config
  uses: mavieth/linode-authenticator@master
  with:
    LINODE_TOKEN: ${{ secrets.LINODE_TOKEN }}
    CLUSTER_NAME: linode1234
```

## Outputs

The following environment variables:

- `KUBE_CONFIG` - the path to the kubernetes config

## license

[MIT](/LICENSE) &copy; 2020 mavieth
