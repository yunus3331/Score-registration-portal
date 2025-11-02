from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

#hello
app = FastAPI()
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def convertToDictionary(file):
    with open(file) as f:
        lines=f.readlines()
    lessons=lines[0].split()
    dictOfScores={}
    for i in range(2,len(lines)):
        scores=lines[i].split()
        scoresDict={}
        for i in range(1,len(scores)):
            scoresDict.update({lessons[i]:scores[i]})
        dictOfScores.update({scores[0]:scoresDict})
    return dictOfScores

def convertToFile(dict,file):
    with open(file,"w") as f:
        f.write(f"Student{' ' * 6}")
        lessons=list(dict["Ali"].keys())
        for i in range(len(lessons)-1):
            f.write(f"{lessons[i]} ")
        else:
            f.write(f"{lessons[len(lessons)-1]}\n")
        f.write(f"{'-'*166}\n")
        names=list(dict.keys())
        for i in range(len(names)):
            f.write(f"{names[i]:<13}")
            scores=list(dict[names[i]].values())
            for j in range(len(scores)-1):
                width=len(lessons[j])+1
                f.write(f"{scores[j]:<{width}}")
            f.write(f"{scores[len(scores)-1]}")
            f.write("\n")


@app.get("/")
async def get_test_data():
    return {"message": "Hello World"}


@app.get("/add")
def add_values(a: int, b: int):
    return {'sum': a+b}

@app.get("/scores")
def showScores(a: str):
    return {'scores':convertToDictionary("knowledgebase.txt")[a]}

@app.get("/lessonscores")
def showScoress(lesson: str):
    scores=[]
    dictionary=convertToDictionary("knowledgebase.txt")
    for name in dictionary.keys():
        scores.append(float(dictionary[name][lesson]))
    return{"scores":scores}

@app.get("/score")
def showScore(a: str, b:str):
    return{'score':convertToDictionary("knowledgebase.txt")[a][b]}

@app.get("/courses")
def showCourses():
    return{'courses':list(convertToDictionary("knowledgebase.txt")["Ali"].keys())}

@app.get("/names")
def showNames():
    return{'names':list(convertToDictionary("knowledgebase.txt").keys())}

@app.post("/change")
def changeScore(esm: str, lesson: str ,score: int):
    dictOfScores=convertToDictionary("knowledgebase.txt")
    dictOfScores[esm][lesson]=score
    convertToFile(dictOfScores,"knowledgebase.txt")