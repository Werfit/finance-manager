# Model

There are 2 models here: **XG Boost** and **Light GBM**. Both of them work relatively similar in terms of accuracy, but **XG Boost** works a lot faster (pretty sure I've done something wrong somewhere).

| Model Name | Time    | MAE   | RMSE  |
| ---------- | ------- | ----- | ----- |
| XG Boost   | 2m 53s  | ~1637 | ~8064 |
| Light GBM  | 23m 16s | ~1698 | ~8336 |

As you can see from **Light GBM** execution time, I wouldn't recommend running it 🥲

### Goal

The final goal of the model is to take some information from a user (his transaction history or maybe statistics of their expenses) and give a prediction on how much the user is going to spend on a category the next month.

### Datasets

There are 2 datasets: **final.csv** and **processed.csv**. The first one is the list of all transactions. The **dataset-processor.py** (you can run it with `uv run dataset-processor.py`) script reads the **final.csv** file (which is the same as from **/model-trainer/database/datasets/final-without-timestamp.csv**) and creates **processed.csv**.

Both of the models work only with **processed.csv**. It is a list of grouped by _category_, _month_ and _user_id_. The processing script also calculates sums amount the spent amount, amount spent on a category the previous month and average sum spent on a category throughout last 3 months.

| Column Name      | Type    | Description                                                                                             |
| ---------------- | ------- | ------------------------------------------------------------------------------------------------------- |
| user_id          | String  | User ID from a database                                                                                 |
| month            | String  | Year and a month in a format {year}-{month}                                                             |
| category         | String  | Category Name                                                                                           |
| total_spent      | Number  | Amount spent on a category during the calendar month                                                    |
| is_holiday_month | Boolean | A month that contains a big holiday (December, January and March for Christmas, New Year and Women Day) |
| last_month_spent | Number  | Amount spent on a category in a previous month                                                          |
| rolling_mean     | Number  | Average spent amount during the last 3 calendar month                                                   |
