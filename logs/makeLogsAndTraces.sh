#! /bin/bash

cargoLists="A B AB BA AAA BBB AAB BBA ABA BAB ABB BAA AAAA BBBB ABBA BAAB ABAB BABA AABB BBAA AABABBAB ABBBABAAABBB"

for cargo in $cargoLists; do
  node ../lib/cli.js exercise2 $cargo --log $cargo.log
  ./trace.py $cargo.log >$cargo.trace
done;
