#include "ovenModule.h"
ovenModule::ovenModule(Adafruit_MotorShield& AFMS, int ovenDCPin)
{
    if(MOTOR_SHIELD)
        ovenMotor = AFMS.getMotor(ovenDCPin);
}
void ovenModule::init()
{
    if(MOTOR_SHIELD)
        ovenMotor->setSpeed(120);//RPM
}
bool ovenModule::toastSandwich(carriageModule& cam, HighTemp& ht)
{
    cam.pushCarriageToOven();
    moveCarriageToOven();
    return true;
    /*if(isOvenReady(ht))
    {
        cam.pushCarriageToOven();
        moveCarriageToOven();
        return true;
    }
    else
        return false;
    */
}
void ovenModule::moveCarriageOut()
{
    ovenMotor->run(FORWARD);
    delay(3000);
    ovenMotor->run(RELEASE);
    /*int sum = 0;
    for(int i = 0; i < 500;i++)
    {
        int position = analogRead(OVEN_IR);
        sum += position;
        if(i%50 == 0)
            Particle.process();
    }
    Serial.println(sum/500);*/
    //TODO: WRITE THIS
}
void ovenModule::moveCarriageToOven()
{
    //TODO: WRITE THIS
    Serial.println("Testing Cheese Stepper/Conveyour Belt");
    ovenMotor->run(BACKWARD);
    delay(3000);
    ovenMotor->run(RELEASE);
}
void ovenModule::testOvenStepper()
{
    Serial.println("Testing Cheese Stepper/Conveyour Belt");
    ovenMotor->run(BACKWARD);
    Serial.println("Move backwards");
    delay(3000);
    ovenMotor->run(RELEASE);
    delay(1000);
    ovenMotor->run(FORWARD);
    delay(3000);
    ovenMotor->run(RELEASE);
}
bool ovenModule::isOvenReady(HighTemp& ht)
{
    Serial.printlnf("Probe Temp:%.2f F",ht.getThmc(1));
    Serial.println("Room Temp:"+String(ht.getRoomTmp(1))+"F");
    if(ht.getThmc(1)>200)
        return true;
    else
        return false;
}
