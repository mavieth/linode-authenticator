
default:
	act --secret-file .github/secrets.env

release:
	npm run build
	git add .
	git commit -m 'Release #major'
	git push

reset:
	rm -rf .git
	git init
	git remote add origin git@github.com:mavieth/linode-authenticator.git
	git add .
	git commit -m 'Initial #major release'
	git push --force


