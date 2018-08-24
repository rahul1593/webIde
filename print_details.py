#!/bin/python

#
#	How to use:
#	__ download the PlantVillage dataset from the following link:
#		https://drive.google.com/file/d/0B_voCy5O5sXMTFByemhpZllYREU/view
#	__ extract the file in some directory
#	__ change the source directory to the "<extract location>/PlantVillage/train" folder
#	__ Now this file can be opened using any program(in any language) using system call 'system("console command")' or any other command
# 	   which allows to execute a console command.
#		__ console command can be 'python print_details.py'
#	__ This program will first output the list of folder names(newline separated)
#		__ Each folder name has structure <crop_name>___<condition>, which forms a single label(means folder name is the label)
#	__ Calling program can store all these labels
#	__ Then to get the location of all the files for a particular label
# 		__ write the label to input of THIS PROGRAM (python print_details.py)
#		__ read the the list of file locations(newline separated)
#		__ calling program can then open and upload the files along with the labels to online service
#	__ This program will generate a file having <label>$$<file_location> data for all the files, which can be used alternatively
#


import sys
import os

source_directory="./PlantVillage/train/"
#
# Dictionary with structure
# "crop_name___condition":[files_list]
#
crops = dict()
for directory in os.listdir(source_directory):
	tmp = directory.split('___')
	if len(tmp) == 2:
		name, condition = tmp
	else:
		continue
	crops[directory] = list()
	for img in os.listdir(source_directory+directory):
		crops[directory].append(source_directory+directory+"/"+img)
of = "crop_labels.txt"
fl = open(of, 'w')
for crop in crops:
	print(crop)
	for f in crops[crop]:
		fl.write(crop+'$$'+f+'\n')
fl.close()

# get crop name to print the file names line by line from terminal
cmd = "s"
while(cmd != "x"):
	cmd = input()
	if cmd in crops:
		for f in crops[cmd]:
			print(f)


