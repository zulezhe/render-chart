import React from 'react';

// 这个文件只包含警告级别的错误
const TestComponent = () => {
  // 这个会产生react-refresh/only-export-components警告
  const helperFunction = () => {
    return 'helper';
  };
  
  return <div>Test Component</div>;
};

// 未使用的变量（但用下划线前缀，应该只是警告）
const _unusedVar = 'this should be just a warning';

export default TestComponent;