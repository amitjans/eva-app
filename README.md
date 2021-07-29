# Eva-app
App to show Eva's eyes and control the actions of it from the touch screen.
Aplicación para controlar el robot social Eva desde la pantalla táctil.

## Wifi
To get the app wifi manager to work, install the ```network manager``` with the following command

```
sudo apt install network-manager network-manager-gnome
```
Also you probably need to remove the following packages

```
sudo apt purge openresolv dhcpcd5
```

If you need to connect to the wifi nework througth cli use the commands below.

```
nmcli d wifi list
```
```
nmcli -a d wifi connect <SSID>
```

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
