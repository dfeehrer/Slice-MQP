#ifndef ovenModule_h
#define ovenModule_h

#include "carriageModule.h"
#include <Adafruit-MotorShield-V2.h>
#include "High_Temp.h"
#include "pins_const.h"
class ovenModule
{
    public:
        ovenModule(Adafruit_MotorShield& AFMS, int ovenDCPin = 2);      // Constructor. 
        void init();   // attaches/sets up the limit buttons and their ISRs on a pin
        void testOvenStepper();
        bool toastSandwich(carriageModule& cam, HighTemp& ht);
        void moveCarriageOut();
        void moveCarriageToOven();
        bool isOvenReady(HighTemp& ht);
    private:
        int toastLevel;
        Adafruit_DCMotor *ovenMotor;
};
#endif
