alphabet = "abcdefghijklmnopqrstuvwxyz"

a_words = {}

for l in alphabet:
    a_words[l] = {}


with open("merged.txt", "r") as f:

    print("\nOrdering words in memory")

    for line in f.readlines():

        split = line.split(" ")

        a_words[split[0][0]][split[0]] = int(split[1])

for l in a_words.keys():

    with open("words2/%s_en_full.js" % l, "w") as f:
        f.write("")

    with open("words2/%s_en_full.js" % l, "a") as f:

        f.write("//Frequency data for all words beginning with %s\n" % l)
        f.write("words = {\n")

        for word in a_words[l].keys():

            f.write('"%s": %s,\n' % (word, a_words[l][word]))

        f.write("};")