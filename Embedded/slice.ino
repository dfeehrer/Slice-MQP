#include <Stepper.h>
#include <SparkFunSX1509.h>
#include "slice.h"
#include <AccelStepper.h>
#include <Adafruit-MotorShield-V2.h>
#include "breadModule.h"
#include "carriageModule.h"
#include "cheeseModule.h"
#include "ovenModule.h"
#include "High_Temp.h"
#include "vexMotor.h"
#include "pins_const.h"
#include <ArduinoJson.h>

STARTUP(WiFi.selectAntenna(ANT_EXTERNAL));

//Pin Expander Info
SX1509 io;

// Create the motor shield object with the default I2C address
Adafruit_MotorShield AFMS;// = Adafruit_MotorShield();
breadModule bm = breadModule(BREAD_VEX);
carriageModule cam = carriageModule(STEP, DIR, SCALE_DATA, SCALE_CLK);
cheeseModule chm = cheeseModule(AFMS, STEP, DIR);
ovenModule om = ovenModule(AFMS);

Timer toastTimer(DEFAULT_TIME,finishToasting, true);
Timer checkTemp(1000,finishToasting);


HighTemp ht(OVEN_TEMP1, OVEN_TEMP2);
volatile bool rst = false;
volatile long encoderTicks = 0;
volatile bool ifLeading;
struct Order{
    int cheeseSlices;
    int toastiness;
    bool chips;
    const char * orderID;
};
Order currentOrder;
void setup()
{
    //Pin Expander Setup
    Serial.begin(9600);//to read serial output

    //while(!io.begin(0x3E))//Address for Pin Expander: 0x3E
    //{
    //    Serial.println("I2C connection failed");
    //    delay(500);
    //}
    //io.pinMode(SX1509_BTN_PIN, INPUT_PULLUP);

    pinMode(ENCODER_BTM,INPUT);     //Bump Switch for Home Position of Bread Dispenser
    pinMode(ENCODER_TOP,INPUT_PULLUP);
    attachInterrupt(ENCODER_TOP,handleEncoderInterrupt,RISING,11);

    pinMode(HOME_SWITCHES,INPUT_PULLUP);
    attachInterrupt(HOME_SWITCHES,setHomePosition, FALLING);

    AFMS.begin();  // create with the default frequency 1.6KHz
    //delay(2000);
    cam.init(io, CARRIAGE_SERVO);
    chm.init(io, KNIFE_POT, CLEANING_VAT_MOTOR, CLEANING_VAT_POT, FRIDGE_SERVO);
    bm.init();
    om.init();
    //chm.testCheeseStepper(io);
    chm.resetKnife(io);
    cam.resetCarriage(io);
    chm.resetCheese(io);
    chm.moveToCutPos();

    chm.cleanKnife(io);
    //chm.moveToCleanPos();
    //chm.moveToCutPos();
    //chm.moveToCutPos();
    //bm.testVexMotor();
    //cam.moveTo(CHEESE_POS,io);

    //chm.cutSlices(2,io);
    //cam.moveTo(OVEN_POS,io);
    //cam.pushCarriageToOven();
    //cam.testServos(10);
    /*bm.testVexMotor();
    cam.moveTo(CHEESE_POS,io);

    cam.moveTo(BREAD_POS,io);
    bm.testVexMotor();*/
    /*cam.moveTo(OVEN_POS,io);
    cam.pushCarriageToOven();
    chm.stopVex();
    om.testOvenStepper();
    chm.stopVex();*/
    //chm.testCheeseStepper(io);
    //
    //checkTemp.start();
    //chm.cleanKnife(io);
    //chm.testVexMotor();
    //om.testOvenStepper();
    //ht.begin();
    //digitalWrite(LED, LOW);
    //pinMode(LE D, OUTPUT);
    //chm.testDCMotor();

    //toastTimer.start();
    Particle.function("order", receiveOrder);
    //chm.cleanKnife(io);
    //cam.moveTo(CHEESE_POS,io);
    //delay(3000);
    //for(int i = 0; i < 2; i++)
    //chm.testDCMotor();
}
//int counter = 0;
//int angle = 90;
//int add_val = -10;

/*void i2cTestLoop()
{
    int position = 0;
    if(io.digitalRead(SX1509_BTN_PIN) == LOW)
    {
        Serial.println("Button Pressed");
        //position = analogRead(A5);
        //Serial.println(position);
        //Serial.println("Potentiometer % Turned:"+String(position*100/4096));
        Serial.println("IT WORKED");
        while(io.digitalRead(SX1509_BTN_PIN)==LOW)
            Particle.process();
        //om.testOvenStepper();
        //chm.testServo();
        //chm.testDCMotor();
        //chm.testCheeseStepper(io);
        //bm.dispenseBread();
        //.testKnifeStepper(io);
        chm.testVexMotor();
        //chm.changeDoorState();
        //if(angle - 10 < 0)
        //    add_val = 10;
        //else if(angle + 10 > 160)
        //    add_val = -10;
        //angle += add_val;
        //cam.pushCarriageToOven();
        //om.testOvenStepper();
    }
    Particle.process();
    //int position = analogRead(A1);
    //counter++;
    /*if(counter%100 == 0)
    {
        Serial.println("Potentiometer Value:" + String(position));
        Serial.println("Potentiometer Position:" + String(position * 100/4096));
    }*/
//}

void loop()
{
    //i2cTestLoop();
    //Serial.println(analogRead(CLEANING_VAT_POT));
}

bool makeOrder()
{
    int state = 0;
    int bread_slices = 0;
    Particle.publish("updateOrderStatus", "{\"ORDER_ID\":\""+String(currentOrder.orderID)+"\",\"NEW_STATUS\":\"assembling\"}", 60, PRIVATE);
    while(true)
    {
        switch(state)
        {
            case 0: Serial.println("state change to bread");
                    cam.moveTo(BREAD_POS, io);
                    bm.testVexMotor();
                    if(true  || cam.checkAddition())
                    {
                            bread_slices++;
                            if(bread_slices == 2)
                            {
                                state = 2;
                                Serial.println("state change to oven");
                            }
                            else
                            {
                                state = 1;
                                Serial.println("state change to cheese");
                            }
                    }
                    else
                    {
                        Serial.println("Bread Addition Failed");
                        return false;
                    }
                    break;
            case 1: cam.moveTo(CHEESE_POS, io);
                    chm.dispenseCheese(currentOrder.cheeseSlices, io);
                    if(true || cam.checkAddition())
                    {
                        Serial.println("State change to toast");
                        state = 0;
                    }
                    else
                    {
                        Serial.println("Cheese Addition Failed");
                        return false;
                    }
                    break;
            case 2: cam.moveTo(OVEN_POS, io);
                    om.toastSandwich(cam, ht);
                    Particle.publish("updateOrderStatus", "{\"ORDER_ID\":\""+String(currentOrder.orderID)+"\",\"NEW_STATUS\":\"toasting\"}", 60, PRIVATE);
                    toastTimer.changePeriod(currentOrder.toastiness*10000);
                    toastTimer.start();
                    Serial.println("Now toasting, moving carriage change to init");
                    cam.moveTo(OVEN_POS - 10000,io);
                    cam.moveTo(BREAD_POS,io);
                    return true;
                    break;
        }
    }
}

void finishToasting()
{
    om.moveCarriageOut();
    Particle.publish("updateOrderStatus", "{\"ORDER_ID\":\""+String(currentOrder.orderID)+"\",\"NEW_STATUS\":\"done\"}", 60, PRIVATE);
    //Serial.println(chm.pot_position);
}
void handleEncoderInterrupt()//ISR
{
    static unsigned long last_interrupt_time1 = 0;
    unsigned long interrupt_time = millis();
    ifLeading = pinReadFast(ENCODER_BTM);
    if(ifLeading)
    {
        encoderTicks++;
        if(encoderTicks >= DROP_POS - 3 && (interrupt_time - last_interrupt_time1 > 800))
        {
            bm.stop();
            last_interrupt_time1 = interrupt_time;
        }
    }
    else
    {
        encoderTicks--;
        if(encoderTicks <= LOAD_POS + 3 && (interrupt_time - last_interrupt_time1 > 800))
        {
            bm.stop();
            last_interrupt_time1 = interrupt_time;
        }
    }
    //Serial.println(encoderTicks);
}
void setHomePosition() //ISR
{
    static unsigned long last_interrupt_time = 0;
    unsigned long interrupt_time = millis();
 // If interrupts come faster than 200ms, assume it's a bounce and ignore
    if (interrupt_time - last_interrupt_time > 1000)
    {
        Serial.println("Interrupt Occurred");
        if(cam.getState() && cam.resetting)
        {
            cam.setZeroPosition();
            cam.resetting = false;
            cam.moveTo(BREAD_POS,io);
            Serial.println("Main Linear Slide Position Set");
        }
        else if(chm.getKnifeState() && chm.resetting)
        {
            chm.setZeroPosition(KNIFE);
            chm.resetting = false;
            chm.moveTo(CUT_POS,io,KNIFE);
            Serial.println("Knife Linear Slide Home Position");
        }
        else if(chm.getCheeseState() && chm.resetting)
        {
            chm.setZeroPosition(CHEESE);
            chm.resetting = false;
            chm.setCheeseState(DISABLE, io);
            Serial.println("Cheese Linear Slide Home Position");
        }
    }
    last_interrupt_time = interrupt_time;
}


int receiveOrder(String order)
{
    StaticJsonBuffer<200> jsonBuffer;
    JsonObject& root = jsonBuffer.parseObject(order);
    //Serial.println(order);

    // Test if parsing succeeds.
    if (!root.success()) {
        Serial.println("parseObject() failed");
        return -1;
    }
    // Fetch values.
    // Most of the time, you can rely on the implicit casts.
    // In other case, you can do root["time"].as<long>();
    currentOrder.cheeseSlices = int(root["cheese"]);
    currentOrder.toastiness = int(root["toast"]);
    currentOrder.chips = bool(root["chips"]);
    currentOrder.orderID = root["order"];

    // Print values.
    Serial.println("# of Cheese Slices: "+String(currentOrder.cheeseSlices));
    Serial.println("Toastiness Level: "+String(currentOrder.toastiness));
    Serial.println("Chips: "+String(currentOrder.chips));
    Serial.print("OrderID: ");
    Serial.println(currentOrder.orderID);
    //digitalWrite(LED, HIGH);
    if(makeOrder())
    {
        Serial.println("Successfully Made Order");
        //digitalWrite(LED, LOW);

    }
    else
    {
        Serial.println("Failed to Make Order");
        //for(int i = 0; i < 10; i++)
        //{
        //    digitalWrite(LED,LOW);
        //    delay(500);
        //    digitalWrite(LED,HIGH);
        //}
    }
}
