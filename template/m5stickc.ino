#include <OpnizEsp32.h>
#include <lib/WiFiConnector.h>
#include <M5StickC.h>

WiFiConnector wifiConnector("<SSID>", "<PASSWORD>");
Opniz::Esp32* opniz = new Opniz::Esp32("<ADDRESS>", <PORT>, "<ID>");

auto blink = [](boolean state) {
    pinMode(M5_LED, OUTPUT);
    digitalWrite(M5_LED, state ? LOW : HIGH);
};

void setup() {
    M5.begin(false, false, true);
    Serial.begin(9600);
    wifiConnector.setTimeoutCallback([]() { esp_restart(); });
    wifiConnector.setConnectingSignal(blink);
    wifiConnector.connect();
    opniz->connect();
}

void loop() {
    opniz->loop();
    wifiConnector.watch();
}
