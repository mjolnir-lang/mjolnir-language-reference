# Thread-local Storage (TLS)

This is a mistake. It is implemented with hidden overhead, not ABI portable, and inherits all the
same problems as global variables. TLS should be implemented by hand if needed.
