#ifndef breadModule_h
#define breadModule_h

#include <Particle.h>
#include <Adafruit-MotorShield-V2.h>
#include "pins_const.h"
#include "vexMotor.h"
class breadModule
{
    public:
        breadModule(int _motorPin);      // Constructor. 
        void init();   // attaches/sets up the limit buttons and their ISRs on a pin
        void dispenseBread();//dispenses one piece of bread and returns to load position
        void resetMotor();
        void testVexMotor();
        void stop();

    private:
        vexMotor motor;
        volatile bool isRunning;
        int motorPin;
};

#endif