## Installing docker Test env

### Ubuntu installation:

1. Docker - `docker run -ti --name sp-home -p 4200:80 -p 3000:81  ubuntu /bin/bash`
2. Get into Docker: `docker exec -it sp-home /bin/bash`
2. NVM - `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash`
3. Load NVM `export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm`
4. install nginx `sudo apt install nginx`
5. install pm2 `npm install -g pm2`


## Database

 1. `apt install postgresql`
2. starting db: `sudo service postgresql start`
3. login as template: `sudo -u postgres psql template1`
4. set password: `ALTER USER postgres with encrypted password 'your_password';`
5. `nano etc/postgresql/16/main/pg_hba.conf`
6. `sudo service postgresql restart`
7. login: `sudo -u postgres psql`
8. create schema: `create schema spHome;`

in file `pg_hba.conf` mode in postgres user should be changed to `md5`


## Backedn:

1. copy from dist folder `docker cp -a ./server/. sp-home:/apps/server`
2. copy env file from server folder `docker cp -a ./.env sp-home:/apps/server/`
3. setup domain: `sudo nano /etc/nginx/sites-available/sp-home`

paste inside:
```
server {
  server_name sp-home www.sp-home;
    location / {
      proxy_pass http://localhost:3000;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_cache_bypass $http_upgrade;
    }
}
```

4. create symlink: `sudo ln -s /etc/nginx/sites-available/your_domain /etc/nginx/sites-enabled/`
5. unlink default: `sudo unlink /etc/nginx/sites-enabled/default`

## Frontend:
Copy web app into www folder:
`docker cp -a ./browser/. sparrow-home:/var/www/html`
