// 测试配置联动功能
console.log('🔧 测试ECharts配置联动功能...');

// 模拟在ChartConfig中更新标题
const simulateTitleUpdate = (newTitle) => {
  console.log(`📝 模拟更新标题为: "${newTitle}"`);

  // 这里应该触发ChartConfig中的handleConfigUpdate
  // 然后检查ConfigEditor和ConfigDebug是否同步更新

  // 模拟状态更新流程
  setTimeout(() => {
    console.log('✅ 期望结果:');
    console.log(`  - ChartConfig输入框: "${newTitle}"`);
    console.log(`  - ConfigEditor JSON: "${newTitle}"`);
    console.log(`  - ConfigDebug面板: "${newTitle}"`);
    console.log('  - 图表预览: 实时更新');
  }, 100);
};

// 运行测试
simulateTitleUpdate('ECharts联动功能测试v3');

console.log('🔍 请在浏览器中测试以下步骤:');
console.log('1. 在ChartConfig基础设置中修改图表标题');
console.log('2. 检查ConfigEditor中的JSON是否同步更新');
console.log('3. 检查ConfigDebug面板中的标题是否更新');
console.log('4. 检查图表预览是否实时更新');
console.log('5. 在ConfigEditor中修改JSON，检查其他组件是否同步');