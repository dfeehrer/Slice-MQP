#include "carriageModule.h"

carriageModule::carriageModule(int step, int dir, int data, int clk)
{
    stepper = AccelStepper(AccelStepper::DRIVER, step, dir);
    HX711ADC scale(data, clk);
}
void carriageModule::init(SX1509& io,int backServoPin)
{
    backServo.attach(CARRIAGE_SERVO);

    /*scale.set_scale(calibration_factor); //This value is obtained by using the SparkFun_HX711_Calibration sketch
    scale.tare();	//Assuming there is no weight on the scale at start up, reset the scale to 0

    currentWeight = scale.get_units();*/

    //backServo.setTrim(3);
    backServo.write(90);
    delay(2000);
    //backServo.detach();
    //backServo.attach(backServoPin);
    //Setting the type of step on the Big Easy Driver, currently 1/2 step
    //stepper.setMaxSpeed(10000);
    //stepper.setAcceleration(2000);
    //stepper.setSpeed(10000);
    stepper.setMaxSpeed(1000);
    stepper.setAcceleration(200);
    stepper.setSpeed(1000);
    resetting = false;
    if(PIN_EXPAND)
    {
        Serial.println("BE HERE");
        io.pinMode(SX1509_MS1, OUTPUT);
        io.pinMode(SX1509_MS2, OUTPUT);
        io.pinMode(SX1509_MS3, OUTPUT);
        io.pinMode(SX1509_CA, OUTPUT);

        io.digitalWrite(SX1509_MS1,HIGH);
        io.digitalWrite(SX1509_MS2,LOW);
        io.digitalWrite(SX1509_MS3,LOW);
        io.digitalWrite(SX1509_CA,HIGH);
    }
    else
    {
        pinMode(CA_ENABLE, OUTPUT);
    }
    setState(DISABLE,io);
}
void carriageModule::resetCarriage(SX1509& io)
{
    Serial.println("Resetting Carriage Position");
    setState(ENABLE, io);
    resetting = true;
    stepper.runToNewPosition(RESET_POS);
    /*stepper.moveTo(RESET_POS);
    while(stepper.distanceToGo() != 0)
        stepper.setSpeed(400);
        stepper.runSpeed();
    }*/
    Serial.println("Done Resetting Carriage Position");

}
bool carriageModule::checkAddition()
{
    double newWeight = scale.get_units();
    if(newWeight > currentWeight)
    {
        currentWeight = scale.get_units();
        return true;
    }
    else
    {
        currentWeight = scale.get_units();
        return false;
    }
}
void carriageModule::setZeroPosition()
{
    stepper.setCurrentPosition(0);
    stepper.stop();
    Serial.println("STOP");
    stepper.setSpeed(400);
}
bool carriageModule::pushCarriageToOven()
{
    backServo.attach(CARRIAGE_SERVO);
    if(FRONT_CARRIAGE_SERVO)
      frontServo.write(30);
    backServo.write(30);
    delay(500);
    if(FRONT_CARRIAGE_SERVO)
      frontServo.write(90);
    backServo.write(90);
}
bool carriageModule::testServos(int angle)
{
    backServo.attach(CARRIAGE_SERVO);
    //frontServo.write(angle + 5);
    delay(100);
    //frontServo.write(angle);
    for(int i = 30; i < 90;i+=10)
    {
      backServo.write(i);
      Serial.println(String(i));
      delay(3000);
    }

}
AccelStepper carriageModule::getStepper()
{
    return stepper;
}
void carriageModule::setState(bool _state, SX1509& io)
{
    if(PIN_EXPAND)
    {
        if(_state)
            io.digitalWrite(SX1509_CA, LOW);
        else
            io.digitalWrite(SX1509_CA, HIGH);
    }
    else
    {
        if(_state )
            digitalWrite(CA_ENABLE , LOW);
        else
            digitalWrite(CA_ENABLE, HIGH);
    }
    state = _state;
}

bool carriageModule::getState()
{
    return state;
}
int carriageModule::getInitPos()
{
    return initPos;
}
void carriageModule::moveTo(int position, SX1509& io)
{
    setState(ENABLE, io);
    stepper.runToNewPosition(position);
    setState(DISABLE, io);
}

/* Non-Blocking Loop
void loop()
{

    if(stepper.distanceToGo()==0)
        switch(state)
        {
            case 0: //stepper.runToNewPosition(20000);
                    if(OrderInQueue)
                    {
                        state = 1;
                        Serial.println("state change");
                        stepper.moveTo(bread_pos);
                    }
                    break;
            case 1: if(dispenseBread()==true)
                        {
                            slices++;
                            if(slices >= 2)
                            {
                                state = 3;
                                Serial.println("state change");
                                stepper.moveTo(oven_pos);
                                slices = 0;
                            }
                            else
                            {
                                state = 2;
                                Serial.println("state change");
                                stepper.moveTo(cheese_pos);
                            }
                        }
                    break;
            case 2: if(dispenseCheese()==true)
                    {
                        stepper.moveTo(bread_pos);
                        Serial.println("state change");
                        state = 1;
                    }
                    break;
            case 3: cookToast(toast_level);
                    Serial.println("state change");
                    state = 4;
                    break;
            case 4: stepper.moveTo(init_pos);
                    state = 0;
                    break;
                    /*counter++;
                    if(counter < 100)
                        state = 4;
                    else
                        counter = 0;
                        state = 5;
                    break;
            case 5: stepper.stop();
                    delay(2000);
                    state = 0;
        }
    stepper.runSpeed();
//}

  //Serial.printlnf("Is it Running:%d" +stepper.isRunning());
  //Serial.println("Speed: " +String(stepper.speed()));
  //Serial.println("Distance: " +String(stepper.distanceToGo()));
  //Serial.println("Distance: " +String(stepper.currentPosition()));
  /*if (stepper.distanceToGo() == 0)
  {
    pos = -pos;
    stepper.moveTo(pos);
    //stepper.setSpeed(3200);
    stepper.setPinsInverted(direction);
    Serial.println("Switch Directions");
  }*/
  //Serial.println("Step Success:" + String(stepper.run()));
  //stepper.run();
/* stepper.setMaxSpeed(1001);  //non-blocking code
    stepper.setSpeed(1000);
    stepper.setAcceleration(400);
    //stepper.setSpeed(4000);
    stepper.moveTo(bump_pos);
    //stepper.setSpeed(3200);*/
