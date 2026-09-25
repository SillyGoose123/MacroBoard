# [u8, 64]

## 1 section
Command

ChangeConfig = 0x01,
GetConfig = 0x02,
Flash = 0x03,
Summ = 0x04,


## Flash sections
1 => Red
2 => Blue
3 => Green
4 => duration in 10 * millis

## Summ sections
0 => Tone::DEFAULT,
1 => Tone::LOW,
2 => Tone::MEDIUM,
3 => Tone::HIGH,
_=> Self::DEFAULT,

## Config
Max array length is always 255 => cause max u8 is length

### Effect 
0-4 => little endian u32 time diff
5 => length of colors
for color => 3
3 * length of colors + 1 

# Result
First u8 says error = 1 or ok = 0.
all u32 are little endian