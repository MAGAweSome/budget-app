<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Category;

class AddDefaultCategories extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:add-default-categories {userId}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Adds default categories to a specified user.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $userId = $this->argument('userId');
        $user = User::find($userId);

        if (!$user) {
            $this->error('User not found!');
            return Command::FAILURE;
        }

        $defaultCategories = [
            ['name' => 'Housing', 'type' => 'spending'],
            ['name' => 'Groceries', 'type' => 'spending'],
            ['name' => 'Transportation', 'type' => 'spending'],
            ['name' => 'Emergency Fund', 'type' => 'savings'],
            ['name' => 'Future Savings', 'type' => 'savings'],
        ];

        foreach ($defaultCategories as $categoryData) {
            // Check if the category already exists for the user to prevent duplicates
            $existingCategory = $user->categories()->where('name', $categoryData['name'])->first();
            if (!$existingCategory) {
                $user->categories()->create($categoryData);
                $this->info("Added category: {$categoryData['name']}");
            } else {
                $this->info("Category '{$categoryData['name']}' already exists for this user. Skipping.");
            }
        }

        $this->info('Default categories added successfully!');
        return Command::SUCCESS;
    }
}
