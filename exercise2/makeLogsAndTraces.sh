#! /bin/bash

cargoLists="A B AB BA AAA BBB AAB BBA ABA BAB ABB BAA AAAA BBBB ABBA BAAB ABAB BABA AABB BBAA AABABBAB ABBBABAAABBB"

mkdir -p log trace

for cargo in $cargoLists; do
  log=log/$cargo.log
  trace=trace/$cargo.trace
  node ../lib/cli.js exercise2 $cargo --log $log
  ./trace.py $log >$trace
done;
