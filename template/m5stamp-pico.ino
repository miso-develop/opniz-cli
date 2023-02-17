#define M5STAMP_PICO_LED_ENABLE
#include <OpnizM5Unified.h>
#include <lib/WiFiConnector.h>

WiFiConnector wifiConnector("<SSID>", "<PASSWORD>");
Opniz::M5Unified* opniz = new Opniz::M5Unified("<ADDRESS>", <PORT>, "<ID>");

void setup() {
    initM5();
    wifiConnector.setTimeoutCallback([]() { esp_restart(); });
    wifiConnector.setConnectingSignal(blinkBlue);
    wifiConnector.connect();
    Serial.printf("opniz server address: %s\nopniz server port: %u\n\n", opniz->getAddress(), opniz->getPort());
    opniz->connect();
}

void loop() {
    opniz->loop();
    wifiConnector.watch();
}
