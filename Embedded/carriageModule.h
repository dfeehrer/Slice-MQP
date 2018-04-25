#ifndef carriageModule_h
#define carriageModule_h

#include "vexMotor.h"
#include <SparkFunSX1509.h>
#include <AccelStepper.h>
#include <Adafruit-MotorShield-V2.h>
#include <HX711ADC.h>
#include "pins_const.h"
#define calibration_factor -1080000.0 //This value is obtained using the SparkFun_HX711_Calibration sketch


class carriageModule
{
    public:
        carriageModule(int, int, int , int);      // Constructor. 
        void init(SX1509&, int);   // attaches/sets up the limit buttons and their ISRs on a pin
        bool pushCarriageToOven();
        AccelStepper getStepper();
        bool getState();
        void setState(bool state, SX1509& io);
        int getInitPos();
        bool checkAddition();
        void moveTo(int, SX1509&);
        void setZeroPosition();
        bool testServos(int angle);
        void resetCarriage(SX1509& io);
        bool resetting;

    private:
        volatile bool state;
        int initPos;
        double currentWeight;
        Servo frontServo;
        Servo backServo;
        AccelStepper stepper;
        HX711ADC scale;
};
#endif