#include <OpnizM5Atom.h>
#include <lib/WiFiConnector.h>

WiFiConnector wifiConnector("<SSID>", "<PASSWORD>");
Opniz::M5Atom* opniz = new Opniz::M5Atom("<ADDRESS>", <PORT>, "<ID>");

void setup() {
    initM5();
    Serial.begin(9600);
    wifiConnector.setTimeoutCallback([]() { esp_restart(); });
    wifiConnector.setConnectingSignal(blinkBlue);
    wifiConnector.connect();
    opniz->connect();
}

void loop() {
    opniz->loop();
    wifiConnector.watch();
}
