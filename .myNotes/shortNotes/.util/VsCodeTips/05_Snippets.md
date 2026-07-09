
---

# 🧩 1️⃣ How to create a snippet (from zero)

### Step 1: Open snippet file

```
Ctrl + Shift + P
→ Snippets: Configure User Snippets
```

Choose:

* a language (e.g. `c.json`, `python.json`)
* or **Global snippets** (works everywhere)

---

### Step 2: Basic snippet structure

```json
{
  "Print to console": {
    "prefix": "log",
    "body": [
      "printf(\"$1\\n\");",
      "$0"
    ],
    "description": "Print line"
  }
}
```

### How to use

* Type `log`
* Press `Tab`

---

# 🧠 Snippet placeholders (CORE CONCEPT)

| Symbol      | Meaning                       |
| ----------- | ----------------------------- |
| `$1, $2`    | Cursor jump positions         |
| `$0`        | Final cursor position         |
| `${1:name}` | Placeholder with default text |

---

# 🔥 Advanced Snippet Tricks (EVERY ONE)

---

## 1️⃣ Multiple cursors (same as your screenshot)

```json
"$1 $2 $3"
```

Usage:

* Type once
* Press `Tab` → moves cursor through each

---

## 2️⃣ Default values

```json
"${1:variable}"
```

Cursor starts with:

```
variable
```

You can overwrite it or keep it.

---

## 3️⃣ Repeated placeholders (VERY powerful)

```json
"${1:name} = ${1:name};"
```

Type once → updates everywhere.

Example result:

```c
count = count;
```

---

## 4️⃣ Final cursor position (`$0`)

```json
"for (int i = 0; i < $1; i++) {",
"\t$0",
"}"
```

After filling `$1`, cursor lands **inside loop**.

---

## 5️⃣ Multiline snippets

```json
"body": [
  "for (int i = 0; i < ${1:n}; i++) {",
  "\t${2:// code}",
  "}"
]
```

---

## 6️⃣ Choice placeholders (dropdown!)

```json
"${1|int,float,double,char|} x;"
```

Press `Tab` → select type from list.

🔥 **Extremely underused**

---

## 7️⃣ Transform placeholders (regex magic)

```json
"${1:name/(.*)/\\U$1/}"
```

Input:

```
count
```

Output:

```
COUNT
```

Used for:

* getters/setters
* macros
* class names

---

## 8️⃣ Built-in variables (context aware)

| Variable            | Meaning                |
| ------------------- | ---------------------- |
| `$TM_FILENAME`      | File name              |
| `$TM_FILENAME_BASE` | Name without extension |
| `$TM_DIRECTORY`     | Folder                 |
| `$CURRENT_YEAR`     | Year                   |
| `$CURRENT_DATE`     | Date                   |

Example:

```json
"// File: $TM_FILENAME"
```

---

## 9️⃣ Conditional placeholders

```json
"${1:var}${1/(var)/ = 0;/}"
```

Advanced use for templates.

---

## 🔧 Full advanced example (C for-loop snippet)

```json
{
  "For Loop Advanced": {
    "prefix": "fori",
    "body": [
      "for (${1|int,long|} ${2:i} = 0; ${2:i} < ${3:n}; ${2:i}++) {",
      "\t$0",
      "}"
    ],
    "description": "Advanced for loop"
  }
}
```

---

## 🧪 Real-life productivity snippets (worth stealing)

### Fast main function (C)

```json
{
  "C main": {
    "prefix": "main",
    "body": [
      "#include <stdio.h>",
      "",
      "int main() {",
      "\t$0",
      "\treturn 0;",
      "}"
    ]
  }
}
```

---

### Competitive programming input

```json
{
  "Fast IO": {
    "prefix": "fastio",
    "body": [
      "ios::sync_with_stdio(false);",
      "cin.tie(NULL);"
    ]
  }
}
```

---

## 🧠 Mental model (IMPORTANT)

> Snippets = **tiny code generators with logic**

They are **not static text**.

---

## ❌ Common mistakes

* Forgetting commas in JSON
* Missing quotes
* Not restarting VS Code
* Wrong language file

---

## 🏆 One-liner takeaway

> *VS Code snippets support placeholders, defaults, repetition, choices, variables, and regex transforms—making them programmable templates.*

---
