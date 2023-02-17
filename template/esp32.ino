#include <OpnizEsp32.h>
#include <lib/WiFiConnector.h>

WiFiConnector wifiConnector("<SSID>", "<PASSWORD>");
Opniz::Esp32* opniz = new Opniz::Esp32("<ADDRESS>", <PORT>, "<ID>");

void setup() {
    Serial.begin(115200);
    wifiConnector.setTimeoutCallback([]() { esp_restart(); });
    wifiConnector.connect();
    Serial.printf("opniz server address: %s\nopniz server port: %u\n\n", opniz->getAddress(), opniz->getPort());
    opniz->connect();
}

void loop() {
    opniz->loop();
    wifiConnector.watch();
}
