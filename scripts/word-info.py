import pandas as pd

df = pd.read_csv("new_frequencies.txt", sep=" ", names=["word", "freq"])

letters = []

def letterCol(row):
    return str(row["word"])[0]

def f(row):
    return str(row["word"])[0] == "a" and row["freq"] < 10000

df[df.apply(f, axis=1)]["freq"].mean()

df["letter"] = df.apply(letterCol, axis=1)



data = {}

for letter in "abcdefghijklmnopqrstuvwxyz":
    words = df[df["letter"] == letter]
    print(words["freq"].quantile(q=0.5)*3)
    # print(words["freq"].median())
    # words[(words["freq"] < 1000) & (words["freq"] > 10)]["freq"].mean()
