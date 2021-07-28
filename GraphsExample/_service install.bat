sc create GraphsExample binpath= "%~dp0GraphsExample.exe" start= delayed-auto
sc failure GraphsExample reset= 120 actions= restart/5000/restart/15000/restart/60000
pause