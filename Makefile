.SILENT:

.PHONY: all
all:


.PHONY: mjc
mjc: $(mjc)
$(mjc):
	echo todo


.PHONY: doc
doc: pdf site


site := doc/site/index.html
mkdocs.yaml := doc/mkdocs.yaml
mkdocs.srcs := $(mkdocs.yaml) $(shell find doc/docs -type f)

.PHONY: site
site: $(site)
$(site): $(mkdocs.srcs)
	mkdocs build -f doc/mkdocs.yaml


pdf := doc/pdf/mjolnir-language-specification-v1.0.pdf
tex := doc/pdf/mjolnir-language-specification-v1.0.tex


.PHONY: pdf
pdf: $(pdf)
$(pdf): $(tex)
	mkdir doc/pdf/out
	pdflatex -synctex=1 -interaction=nonstopmode -output-directory=doc/pdf/out $(tex)


.PHONY: clean
clean:
	rm -rf doc/site
	rm -rf doc/pdf/out
