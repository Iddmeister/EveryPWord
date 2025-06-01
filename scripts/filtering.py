# from PyDictionary import PyDictionary

# dictionary = PyDictionary()

# def word_in_dict(word):
#     return not (dictionary.meaning(word, True) is None)


alphabet = "abcdefghijklmnopqrstuvwxyz"

all_words = {}

for l in alphabet:
    all_words[l] = []

counter = 0

with open("orig_all_words.txt") as f:
    print("Loading entire dictionary\n")
    for line in f.readlines():

        word = line.rstrip("\n")
        all_words[word[0]].append(word)

        counter += 1
        print("word %s - %s" % (counter, line.rstrip("\n")), end="\r")

    print("\n\nRead list of all english words")
    f.close()

counter = 0

freq_lines = []


with open("orig_en_full.txt", "r") as f:
    freq_lines = f.readlines()

print("\nMaximum words - %s" % len(freq_lines))

try:
    with open("new_frequencies.txt", "r") as f:
        
        lines = f.readlines()
        last_entry = lines[-1].rstrip("\n")
        word = last_entry.split(" ")[0]

        print("Last entry on line %s - %s" % (len(lines)-1, word))

        for line in freq_lines:
            if line.split(" ")[0] == word:
                counter += 1
                print("Resuming from counter %s word - %s" % (counter, freq_lines[counter].split(" ")[0]))
                break
            else:
                counter += 1
except:
    print("Could not find frequencies file, creating one")
    f = open("new_frequencies.txt", "w")
    f.close()


print("\nFiltering words")

with open("new_frequencies.txt", "a") as f:
        
    for l in range(counter, len(freq_lines)):

        line = freq_lines[l].rstrip("\n")

        split = line.split(" ")

        word = split[0]
        freq = int(split[1])

        valid_word = True

        for letter in word:
            if not (letter in alphabet):
                valid_word = False
                break

        if not valid_word:
            continue

        if not (word in all_words[word[0]]):
            continue

        # if not word_in_dict(word):
        #     continue

        f.write("%s %s\n" % (word, freq))

        if (l % 5000) == 0:
            print("%s - %s" % (l, word), end="\r")



            
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
