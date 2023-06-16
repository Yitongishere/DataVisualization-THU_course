import json
import csv

def cumulative_sum(arr):
    result = []
    sum_so_far = 0
    for num in arr:
        sum_so_far += num
        result.append(sum_so_far)
    return result

keys = ['round', 'teamname', 'score', 'goals', 'diff_goals']
# 读取JSON文件
with open('data.json', 'r') as json_file:
    json_data = json.load(json_file)

    teams = list(json_data.keys())
    # print(teams)

    for team in teams:
        goals_ = json_data[f'{team}']['totalGoalDetail']
        goals = cumulative_sum(goals_)
        diff_goals_ = json_data[f'{team}']['goalDifferenceDetail']
        # print(diff_goals_)
        diff_goals = cumulative_sum(diff_goals_)
        # print(diff_goals, '\n')



# 写入CSV文件
with open('bubble.csv', 'w', newline='') as csv_file:
    writer = csv.writer(csv_file)

    # 写入CSV文件的标题行（键）
    writer.writerow(keys)

    # 写入CSV文件的内容（值）
    for i in range(39):
        for team in teams:
            item = f'{i}' + ','

            item += team + ','

            score = str(json_data[f'{team}']['score'][i])
            item += score + ','

            goals_ = json_data[f'{team}']['totalGoalDetail']
            goals = cumulative_sum(goals_)
            if i == 0: goal = '0'
            else: goal = str(goals[i-1])
            item += goal + ','

            diff_goals_ = json_data[f'{team}']['goalDifferenceDetail']
            diff_goals = cumulative_sum(diff_goals_)
            if i == 0: diff_goal = '0'
            else: diff_goal = str(diff_goals[i-1])
            item += diff_goal
            print(item)

            writer.writerow([item.strip('"')])
