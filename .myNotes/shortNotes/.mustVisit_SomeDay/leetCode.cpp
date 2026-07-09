// Heap
//
// Always eat the apple that will rot soon.

//! https://leetcode.com/problems/maximum-number-of-eaten-apples/

class Solution {
 public:
  int eatenApples(vector<int>& apples, vector<int>& days) {
    int n = apples.size();

    auto heap = priority_queue(greater(), std::move(vector<int>()));  // min-heap for rot date
    auto counts = vector<int>(n + 2e4);                               // number of apples

    // Loop
    auto ans = 0;
    for (auto day = 0; day < n; ++day) {
      auto apple = apples[day], rotDay = day + days[day];

      // grow apple
      if (counts[rotDay] == 0) heap.push(rotDay);
      counts[rotDay] += apple;

      // Rot apple
      while (!heap.empty() && heap.top() <= day) heap.pop();

      // Eat apple
      if (!heap.empty()) {
        ++ans;
        --counts[heap.top()];
        if (counts[heap.top()] == 0) heap.pop();
      }
    }

    for (auto day = n; !heap.empty(); ++day) {
      // Rot apple
      while (!heap.empty() && heap.top() <= day) heap.pop();

      // Eat apple
      if (!heap.empty()) {
        ++ans;
        --counts[heap.top()];
        if (counts[heap.top()] == 0) heap.pop();
      }
    }

    return ans;
  }
};
