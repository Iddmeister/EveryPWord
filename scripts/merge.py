# from PyDictionary import PyDictionary

# dictionary = PyDictionary()

# def word_in_dict(word):
#     return not (dictionary.meaning(word, True) is None)

orig = {}

with open("new_frequencies.txt", "r") as f:

    for line in f.readlines():

        s = line.split(" ")

        orig[s[0]] = int(s[1])

with open ("newest_frequencies.txt", "r") as f:

    with open("merged.txt", "a") as m:

        for line in f.readlines():
            
            s = line.split(" ")
            freq = -1

            if s[0] in orig.keys():
                freq = orig[s[0]]
            else:
                freq = int(s[1])

            m.write("%s %s\n" % (s[0], freq))