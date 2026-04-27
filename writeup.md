![R2-D2](<Screenshot 2026-04-26 at 8.10.20 PM.png>)

The sound I was attempting to recreate was R2-D2 from Star Wars.
I think overall I did a good job however, I do concede I wasn't able to get the same cadence, mainly because I don't know binary (the language his beeps and boops come from). The speed of R2-D2 was also difficult to replicate when I sped up my code it mumbled the sounds and I wasn't able to find the perfect balance between sound and frequency. 

My process for making the sound was aided with AI especially in the structure of the code and the random sound generation. The instructions from the textbook were helpful but I was having a little trouble translating those instructions into code. I follwed the following structure

1. Initalize a simple FM synth with two sine waves, one as a carrier for the main pitch and one as a modulator for the texture of the sound to make it sound less plain.

2. To simulate R2-D2's voice I used two lowpass filters and two highpass filters to create a robotic voice.

3. To create the kind of babbling R2-D2 is known for I used a JavaScript scheduler to get random noices to play at random intervals to kind of emulate talking. It would either sweep the main pitch up or down, change the ratio of the modulator to the carrier, change the intensity of the modulator, or change the volume of the sound.

4. For the beeps and whistles I used similar techniques but instead of using a scheduler I used the random interval timer function to get random bursts of noise that kind of makes it sound like he is screaming and trying to get your attention.

5. I kept the modulaiton index very high (up to 6000 Hz) so the frequencies would be all over the place which kind of helps the beepiness.

Overall I think this is a good representation of the sound I was going for and I would use these techniques again in the future.

