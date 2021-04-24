# Eva-app
App to show Eva's eyes and control the actions of it from the touch screen.
Aplicación para controlar el robot social Eva desde la pantalla táctil.

## Production configuration
The following steps allow the automatic startup of the Eva-app software every time you turn it on.

For this we will use ```systemd```, so the first step is to create a new service
```bash
nano /etc/systemd/system/eva.service
```
Inside config:

```bash
[Unit]
Description=Eva
After=network.target

[Service]
Type=simple
User=USER
LimitNOFILE=1024

Restart=on-failure
RestartSec=10
startLimitIntervalSec=60
Environment=DISPLAY=:0
ExecStart=/PATH/TO/THE/APP.AppImage

PermissionsStartOnly=true
StandardOutput=syslog
StandardError=syslog

[Install]
WantedBy=multi-user.target
```
You need to change the ```User``` and ```ExecStart```.

Now you need to add the service to the list of services to be started at boot.
```bash
systemctl enable eva.service
```
Finally reload the deamon.

```bash
systemctl --system daemon-reload
```
