score_if_not_found = 1

alphabet = "abcdefghijklmnopqrstuvwxyz"

all_words = []

counter = 0

with open("orig_all_words.txt") as f:
    print("Loading entire dictionary\n")
    for line in f.readlines():

        word = line.rstrip("\n")
        all_words.append(word)

        counter += 1
        print("word %s - %s" % (counter, line.rstrip("\n")), end="\r")

    print("\n\nRead list of all english words")
    f.close()

counter = 0

orig_words = {}

with open("new_frequencies.txt", "r") as f:

    print("\nLoading database frequencies")

    for line in f.readlines():

        split = line.split(" ")

        orig_words[split[0]] = int(split[1])

print("\nSaving Frequencies")

with open("new_and_improved_frequencies.txt", "a") as f:

    for w in range(len(all_words)):

        word = all_words[w]

        freq = score_if_not_found

        if (word in orig_words):
            freq = orig_words[word]

        f.write("%s %s\n" % (word, freq))

        if (w % 5000) == 0:
            print("%s - %s" % (w, word), end="\r")

print("\nDone :)")

            
# a_words = {}

# for l in alphabet:
#     a_words[l] = {}


# with open("orig_en_full.txt", "r") as f:

#     print("\nOrdering words")

#     for line in f.readlines():

#         split = line.split(" ")

#         # if not (split[0][0] in alphabet):
#         #     continue

#         valid_word = True

#         for letter in split[0]:
#             if not (letter in alphabet):
#                 valid_word = False
#                 break

#         if not valid_word:
#             continue

#         if not (split[0] in all_words):
#             continue

#         counter += 1

#         if (counter % 5000) == 0:
#             print("%s - %s" % (counter, split[0]), end="\r")

#         # if not (split[0] in all_words):
#         #     continue

#         a_words[split[0][0]][split[0]] = int(split[1])

#         # if counter >= 10000:
#         #     break


#     print("\nOrdered %s words" % counter)

# for l in a_words.keys():

#     with open("words/%s_en_full.js" % l, "w") as f:
#         f.write("")

#     with open("words/%s_en_full.js" % l, "a") as f:

#         f.write("//Frequency data for all words beginning with %s\n" % l)
#         f.write("words = {\n")

#         for word in a_words[l].keys():

#             f.write('"%s": %s,\n' % (word, a_words[l][word]))

#         f.write("};")
