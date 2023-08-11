# Program

A program consists of a processing system and static and dynamic memory.

A program uses a unique address space and may use multiple processors or consist of multiple threads.

A program requires some initial setup before it executes `main()`.
First the hardware required for loading the program code and initializing system memory must be run.

A program may be executed in different environments, either baremetal or within an operating system.

A baremetal program must perform platform specific initialization and neither accepts arguments nor
returns a value.

A program executed within an operating system context as a process has little initialization
to perform and may accept arguments from the environment and return an exit code to the system
upon completion.
