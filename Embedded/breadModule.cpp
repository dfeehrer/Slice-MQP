#include "breadModule.h"

breadModule::breadModule(int _motorPin)
{
	motorPin = _motorPin;
}
void breadModule::init()
{
    motor.attach(motorPin);
    stop();
}
void breadModule::dispenseBread()
{
		isRunning = true; //requires the dispenser to be zeroed everytime the system starts up by hand aka in load position
		motor.write(-150);
		while(isRunning);
		Serial.println("Dispensed Bread");
		delay(500);
		isRunning = true;
		motor.write(150);
		while(isRunning);
		Serial.println("Dispenser to Original Position");
		delay(500);
		/*motor->run(FORWARD);
    delay(2000);
    int currentPos = analogRead(potPin);
    int rotations = 0;
    bool destination = true;
    while(destination)
    {
        if(currentPos - 100  > analogRead(potPin))
        {
            rotations++;
            Serial.println("Rotations"+String(rotations));
            delay(500);
        }
        if(rotations == 2)
        {
            while((analogRead(potPin) * 100/4096) < 30 )
                Particle.process();
            motor->run(RELEASE);
            Serial.println("Reached Dispense Position");
            destination = false;
        }
        currentPos = analogRead(potPin);
        Particle.process();
    }*/


    /*if(motorDirection)//Finds the Load Position during the first time
    {
        currentPower = 255;
        myVexMotor.write(currentPower);
        Serial.println("Bread Dispenser Returning Home");
        motorStallTimer.start();
        while(motorDirection)
            Particle.process();
        motorStallTimer.reset();
        delay(5000);
    }
    currentPower = -255;
    myVexMotor.write(currentPower);    //io.analogWrite(SX1509_PWM_PIN,255);
    Serial.println("Bread Dispensing");
    motorStallTimer.start();
    while(!motorDirection)
    {
        //Serial.println("Waiting on Motor Direction to turn from false to true");
        Particle.process();
    }
    motorStallTimer.reset();
    delay(5000);
    currentPower = 255;
    myVexMotor.write(currentPower);
    motorStallTimer.start();
    while(motorDirection)
    {
        Particle.process();
    }
    motorStallTimer.reset();
    Serial.println("Bread Dispenser Returning Home and Exiting Function");
    return true;
    */
}
void breadModule::testVexMotor()
{
    isRunning = true; //requires the dispenser to be zeroed everytime the system starts up by hand aka in load position
    motor.write(-160);
    while(isRunning);
    Serial.println("Dispensed Bread");
    delay(500);
    isRunning = true;
    motor.write(160);
    while(isRunning);
    Serial.println("Dispenser to Original Position");
		delay(500);

}
void breadModule::stop()
{
    motor.write(0);
    isRunning = false;
    Serial.println("Motor Stopped");
}

void breadModule::resetMotor()
{
    //myVexMotor.write(0);
    Serial.println("Motor Stalled");
    delay(1000);
    //myVexMotor.write(currentPower);
}
