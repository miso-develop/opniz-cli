#include <OpnizEsp32.h>
#include <lib/WiFiConnector.h>

WiFiConnector wifiConnector("<SSID>", "<PASSWORD>");
Opniz::Esp32* opniz = new Opniz::Esp32("<ADDRESS>", <PORT>, "<ID>");

void setup() {
    Serial.begin(9600);
    wifiConnector.setTimeoutCallback([]() { esp_restart(); });
    wifiConnector.connect();
    opniz->connect();
}

void loop() {
    opniz->loop();
    wifiConnector.watch();
}
