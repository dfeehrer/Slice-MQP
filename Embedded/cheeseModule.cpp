#include "cheeseModule.h"
#include <Stepper.h>

#define DOWN  1
#define UP 0
#define STD_TIME 3

cheeseModule::cheeseModule(Adafruit_MotorShield& AFMS, int step, int dir, int knifeDCpin,
                           int cheeseSteps, int cheeseStepPin)
{
    if(MOTOR_SHIELD)
        knifeDC = AFMS.getMotor(knifeDCpin);
    //AFMS.getStepper(cheeseSteps, cheeseStepPin);
    knifeStepper = AccelStepper(AccelStepper::DRIVER, step, dir);
    cheeseStepper = AccelStepper(AccelStepper::DRIVER, step, dir);

}
void cheeseModule::init(SX1509& io, int _potPin, int vexPin, int vexPot, int servoPin)
{
    //_io = io;
    potPin = _potPin;
    if(MOTOR_SHIELD)
      knifeDC->setSpeed(80); //parameter/255 is percentage of full speed
    //Setting the type of step on the Big Easy Driver, currently 1/2 step
    if(PIN_EXPAND)
    {
        io.pinMode(SX1509_MS1, OUTPUT);
        io.pinMode(SX1509_MS2, OUTPUT);
        io.pinMode(SX1509_MS3, OUTPUT);
        io.pinMode(SX1509_KN, OUTPUT);
        io.pinMode(SX1509_RELAY, OUTPUT);
        io.pinMode(SX1509_CHE, OUTPUT);


        io.digitalWrite(SX1509_MS1,HIGH);
        io.digitalWrite(SX1509_MS2,LOW);
        io.digitalWrite(SX1509_MS3,LOW);
        io.digitalWrite(SX1509_RELAY,LOW);
    }
    else
    {
        pinMode(CHE_ENABLE,OUTPUT);
        pinMode(KN_ENABLE,OUTPUT);
        pinMode(RELAY,OUTPUT);
    }
    setCheeseState(DISABLE, io);
    setKnifeState(DISABLE, io);
    resetting = false;
    setKnifeMode(TRAVEL,io);

    cheeseStepper.setMaxSpeed(1000);
    cheeseStepper.setAcceleration(200);
    cheeseStepper.setSpeed(1000);
    //RPM
    //testCheeseStepper(io);
    //digitalWrite(vexPin,LOW);
    myVexMotor.attach(vexPin);
    //myVexMotor.write(90);
    vexPotPin = vexPot;

    /*doorServo.attach(servoPin);
    state = OPEN;
    changeDoorState();
    currentPower = 0;*/
}
void cheeseModule::setCheeseState(bool state, SX1509& io)
{
   if(PIN_EXPAND)
   {
       if(state)
            io.digitalWrite(SX1509_CHE, LOW);
        else
            io.digitalWrite(SX1509_CHE, HIGH);
   }
   else
   {
       if(state)
            digitalWrite(CHE_ENABLE, LOW);
        else
            digitalWrite(CHE_ENABLE, HIGH);
   }
    cheese_state = state;
}
void cheeseModule::setKnifeMode(int type, SX1509& io)
{
    if(SLICE == type)
    {
        knifeStepper.setMaxSpeed(500);
        knifeStepper.setAcceleration(50);
        knifeStepper.setSpeed(500);
        toggleKnifePower(ON, io);
    }
    else
    {
        toggleKnifePower(OFF, io);
        knifeStepper.setMaxSpeed(1000);
        knifeStepper.setAcceleration(100);
        knifeStepper.setSpeed(1000);
    }

}
void cheeseModule::setZeroPosition(int stepper)
{
    if(stepper == KNIFE)
    {
        knifeStepper.setCurrentPosition(0);
        knifeStepper.setSpeed(400);
    }
    else
    {
        cheeseStepper.setCurrentPosition(0);
        cheeseStepper.setSpeed(CHEESE_SPEED);
    }
}
void cheeseModule::setKnifeState(bool state, SX1509& io)
{
    if(PIN_EXPAND)
    {
       if(state)
            io.digitalWrite(SX1509_KN, LOW);
        else
            io.digitalWrite(SX1509_KN, HIGH);
    }
    else
    {
        if(state)
            digitalWrite(KN_ENABLE, LOW);
        else
            digitalWrite(KN_ENABLE, HIGH);
    }
    knife_state = state;
}
bool cheeseModule::getCheeseState()
{
    return cheese_state;
}
bool cheeseModule::getKnifeState()
{
    return knife_state;
}
void cheeseModule::moveTo(int position, SX1509& io, int stepper)
{
    if(KNIFE == stepper)
    {
        setCheeseState(DISABLE, io);
        setKnifeState(ENABLE, io);
        knifeStepper.runToNewPosition(position);
        setKnifeState(DISABLE, io);
    }
    else
    {
        setKnifeState(DISABLE, io);
        setCheeseState(ENABLE, io);
        cheeseStepper.runToNewPosition(position);
        setCheeseState(DISABLE, io);
    }
}
void cheeseModule::resetKnife(SX1509& io)
{
    Serial.println("Resetting Knife Position");
    setCheeseState(DISABLE, io);
    setKnifeState(ENABLE, io);
    resetting = true;
    knifeStepper.runToNewPosition(RESET_POS);
    Serial.println("Done Resetting Knife Position");
}
void cheeseModule::resetCheese(SX1509& io)
{
    Serial.println("Resetting Cheese Position");
    setKnifeState(DISABLE, io);
    setCheeseState(ENABLE, io);
    resetting = true;
    cheeseStepper.runToNewPosition(RESET_POS);
    Serial.println("Done Resetting Cheese Position");
}
bool cheeseModule::moveToCutPos()
{
    knifeDC->run(BACKWARD);
    while(analogRead(potPin) > 1350);
    knifeDC->run(RELEASE);
    Serial.println("Reached Cutting Position");
}
void cheeseModule::stopVex()
{
    myVexMotor.write(0);
}
bool cheeseModule::cutSlices(int slices, SX1509& io)
{
    //moveToCutPos();
    cheeseStepper.setSpeed(400);
    int init_pos = 0;
    //moveTo(init_pos,io,CHEESE);
    //delay(3000);
    for(int i = 1;i <= slices; i++)
    {
        moveTo(SLICE_WIDTH*i,io,CHEESE);
        setKnifeMode(SLICE,io);
        moveTo(12000,io,KNIFE);
        setKnifeMode(TRAVEL,io);
        moveTo(SLICE_WIDTH * (i - 1) ,io,CHEESE);
        moveTo(100,io,KNIFE);
    }
}
bool cheeseModule::moveToCleanPos()
{
    knifeDC->run(FORWARD);
    while(analogRead(potPin) < 2500);
    knifeDC->run(RELEASE);
    Serial.println("Reached Knife Cleaning Position");
    return true;
}

void cheeseModule::dispenseCheese(int slices, SX1509& io)
{
    setKnifeState(ENABLE, io);
    moveToCutPos();
    cutSlices(slices, io);
}
void cheeseModule::toggleKnifePower(int state, SX1509& io)
{
    if(PIN_EXPAND)
    {
        if(ON == state)
            io.digitalWrite(SX1509_RELAY,HIGH);
        else
            io.digitalWrite(SX1509_RELAY,LOW);
    }
    else
    {
        if(ON == state)
            digitalWrite(RELAY,HIGH);
        else
            digitalWrite(RELAY,LOW);
    }
}

bool cheeseModule::cleanKnife(SX1509& io)
{
    moveToCleanPos();
    std::array <int, 3> positions = {100, 1550, 3050};
    for(int i = 0; i < 1;i++)// positions.size();i++)
    {
        /*myVexMotor.write(-180);
        Serial.println("Iteration");
        int position = analogRead(CLEANING_VAT_POT);
        while(position < positions[i] - 10 || (position > positions[i] + 10))
            position = analogRead(CLEANING_VAT_POT);
        myVexMotor.write(0);*/
        Serial.println("CLEAN");
        moveTo(IN_VAT_POS,io,KNIFE);
        toggleKnifePower(ON,io);
        delay(DEFAULT_TIME);
        toggleKnifePower(OFF,io);
        moveTo(OUT_VAT_POS,io,KNIFE);
    }
    moveTo(CUT_POS,io,KNIFE);
    moveToCutPos();
    return true;
}
void cheeseModule::testKnifeStepper(SX1509& io)
{
    moveTo(RESET_POS*-1,io,KNIFE);
}
void cheeseModule::testCheeseStepper(SX1509& io)
{
    Serial.println("Testing Cheese Stepper/Conveyour Belt");
    moveTo(RESET_POS,io,CHEESE);
}
void cheeseModule::testDCMotor()
{
    moveToCleanPos();
    delay(3000);
    moveToCutPos();
    delay(3000);
    /*knifeDC->run(FORWARD);
    delay(500);
    knifeDC->run(RELEASE);*/
}

void cheeseModule::testVexMotor()
{

    std::array <int, 3> positions = {500, 1550, 3500};
    for(int i = 0; i < positions.size();i++)
    {
        Serial.println("Iteration");
        if(i == 0)
          myVexMotor.write(255);
        else
          myVexMotor.write(-255);
        while(pot_position < positions[i] - 10 || (pot_position > positions[i] + 10))
        {
            pot_position = analogRead(CLEANING_VAT_POT);
        }
        myVexMotor.write(0);
        delay(2000);
    }
    /*while(true)
    {
    myVexMotor.write(255);
    delay(2000);
    myVexMotor.write(0);
    delay(5000);
    myVexMotor.write(-255);
    delay(2000);
    myVexMotor.write(0);
    delay(5000);
    }*/
}
int cheeseModule::changeDoorState()
{
    if(state == OPEN)
    {
        doorServo.write(0);
        return state = CLOSED;
    }
    else
    {
        doorServo.write(90);
        return state = OPEN;
    }

}
AccelStepper cheeseModule::getKnifeStepper()
{
    return knifeStepper;
}
AccelStepper cheeseModule::getCheeseStepper()
{
    return cheeseStepper;
}
