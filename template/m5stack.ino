#include <OpnizEsp32.h>
#include <lib/WiFiConnector.h>
#include <M5Stack.h>

WiFiConnector wifiConnector("<SSID>", "<PASSWORD>");
Opniz::Esp32* opniz = new Opniz::Esp32("<ADDRESS>", <PORT>, "<ID>");

auto blink = [](boolean state) {
    M5.Lcd.setBrightness(state ? 8 : 0);
    M5.Lcd.setCursor(0, 0);
    M5.Lcd.setTextSize(2);
    M5.Lcd.println("");
    M5.Lcd.println("  Wi-Fi SSID:\n    <SSID>\n");
    M5.Lcd.println("  Host address:\n    <ADDRESS>\n");
    M5.Lcd.println("  opniz port:\n    <PORT>\n");
    M5.Lcd.println("  opniz ID:\n    <ID>\n");
};

void setup() {
    M5.begin(true, false, true, true);
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
