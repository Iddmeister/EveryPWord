
alphabet = "abcdefghijklmnopqrstuvwxyz"

a_words = {}

for l in alphabet:
    a_words[l] = {}

counter = 0

with open("orig_en_full.txt", "r") as f:

    for line in f.readlines():

        split = line.split(" ")

        if not (split[0][0] in alphabet):
            continue

        a_words[split[0][0]][split[0]] = int(split[1])

        counter += 1

    f.close()

    print("ordered %s words" % counter)

for l in a_words.keys():

    with open("words/%s_en_full.js" % l, "w") as f:
        f.write("")
        f.close()

    with open("words/%s_en_full.js" % l, "a") as f:

        f.write("//Frequency data for all words beginning with %s\n" % l)
        f.write("words = {\n")

        for word in a_words[l].keys():

            f.write('"%s": %s,\n' % (word, a_words[l][word]))

        f.write("};")

        f.close()
