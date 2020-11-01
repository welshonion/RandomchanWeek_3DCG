//#include<windows.h>
#include<iostream>
#include<string>
#pragma comment(lib,"shell32.lib")

using namespace std;

void main(){
	ShellExecute(NULL, "open", "https://welshonion.github.io/RandomchanWeek_3DCG", NULL, NULL, SW_SHOWNORMAL);
}
