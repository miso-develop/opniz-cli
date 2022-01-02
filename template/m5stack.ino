#include <OpnizEsp32.h>
#include <lib/WiFiConnector.h>
#include <M5Stack.h>

WiFiConnector wifiConnector("<SSID>", "<PASSWORD>");
Opniz::Esp32* opniz = new Opniz::Esp32("<ADDRESS>", <PORT>, "<ID>");

auto blink = [](boolean state) {
    pinMode(21, OUTPUT);
    digitalWrite(21, state ? LOW : HIGH);
};

void setup() {
    M5.begin(false, false, true, true);
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
