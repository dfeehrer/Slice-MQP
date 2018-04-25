#ifndef pins_const_h
#define pins_const_h

#define I2C_DATA D0
#define I2C_CLK D1
#define CLEANING_VAT_MOTOR D2
#define BREAD_VEX D3
#define STEP D4
#define DIR D5
#define ENCODER_BTM D6
#define ENCODER_TOP D7
#define LED D7 //backburner
#define HOME_SWITCHES A0
#define OVEN_TEMP1 A1
#define OVEN_TEMP2 A2 //backburner
#define CHE_ENABLE A2     //OVEN_TEMP2
#define KNIFE_POT A3
#define CLEANING_VAT_POT A4
#define CARRIAGE_SERVO A5
#define CA_ENABLE A6 //temporary
#define OVEN_IR A6 //backburner
#define RELAY A7 //temporary
#define SCALE_DATA A7 //backburner
#define FRIDGE_SERVO RX
#define KN_ENABLE TX
#define SCALE_CLK TX //backburner

#define SX1509_BTN_PIN 0
#define SX1509_MS1 3
#define SX1509_MS2 2
#define SX1509_MS3 1
#define SX1509_CA 5
#define SX1509_KN 6 //Enable for Knife Stepper
#define SX1509_CHE 4 //Enable for Cheese Stepper
#define SX1509_RELAY 12//KNIFE ON/OFF

#define BREAD_POS 250
#define CHEESE_POS 12175
#define OVEN_POS 213000/8 - 1500
#define RESET_POS -300000
#define ENABLE true
#define DISABLE false

#define IN_VAT_POS 24000
#define OUT_VAT_POS 8500
#define CUT_POS 500
#define SLICE_WIDTH 8000
#define KNIFE 1
#define CHEESE 0

#define CHEESE_SPEED 1000

#define ON  1
#define OFF 0
#define SLICE 1
#define TRAVEL 0

#define LOAD_POS 0
#define DROP_POS 65

#define PIN_EXPAND false
#define MOTOR_SHIELD true
#define FRONT_CARRIAGE_SERVO false
#define DEFAULT_TIME 10000


#endif
