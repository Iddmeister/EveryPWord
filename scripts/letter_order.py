import random

random.seed(696969)

alphabet = "abcdefghijklmnopqrstuvwxyz"

order = []

used = []

days = 2600

for d in range(1, days+1):

    letter = ""

    while True:
        letter = alphabet[random.randrange(0, len(alphabet))]
        if (letter in used) or (letter == order[-1] if len(order) > 0 else False):
            continue
        else:
            break

    order.append(letter)
    used.append(letter)

    if (d%26) == 0:
        used.clear()

checks = {}

for letter in alphabet:
    checks[letter] = 0

for letter in order:
    checks[letter] += 1


print("\nGenerated Order:\n")
print(order)
print("\nLetter Frequencies:\n")
print(checks)

with open("order.js", "w") as f:

    f.write("//Order of letters for each day\n")
    f.write("letter_order = [\n")

    for letter in order:

        f.write('"%s",\n' % letter)

    f.write("];")