#ifndef cheeseModule_h
#define cheeseModule_h

#include <Adafruit-MotorShield-V2.h>
#include <AccelStepper.h>
#include <SparkFunSX1509.h>
#include "vexMotor.h"
#include "pins_const.h"
#include <Stepper.h>
class cheeseModule
{
    public:
        cheeseModule(Adafruit_MotorShield& ,int, int, int = 1,
                           int = 200, int = 1);      // Constructor.
        void init(SX1509& io, int _potPin, int servoPin, int vexPotPin, int doorServoPin);
        bool moveToCutPos();
        bool moveToCleanPos();
        void dispenseCheese(int slices, SX1509& io);
        bool cleanKnife(SX1509& io);
        AccelStepper getKnifeStepper();
        AccelStepper getCheeseStepper();
        void testDCMotor();
        void testKnifeStepper(SX1509& io);
        void testCheeseStepper(SX1509& io);
        void testVexMotor();
        bool cutSlices(int slices, SX1509& io);
        void toggleKnifePower(int state, SX1509& io);
        int changeDoorState();
        void setCheeseState(bool state,SX1509& io);
        void setKnifeState(bool state,SX1509& io);
        bool getCheeseState();
        bool getKnifeState();
        void resetKnife(SX1509& io);
        void resetCheese(SX1509& io);
        void setZeroPosition(int stepper);
        void moveTo(int position, SX1509& io, int stepper);
        void setKnifeMode(int type, SX1509& io);
        bool resetting;
        void stopVex();
        volatile int pot_position;

    private:
        const int resetPosition = -10000;
        int sliceWidth;
        int potPin;
        int vexPotPin;
        int current_position;
        int currentPower;
        vexMotor myVexMotor;
        Adafruit_DCMotor *knifeDC;
        AccelStepper knifeStepper;
        AccelStepper cheeseStepper;
        int state; //state of the door
        const int OPEN = 1;
        const int CLOSED = 0;
        Servo doorServo;
        bool cheese_state;
        bool knife_state;

};
#endif
