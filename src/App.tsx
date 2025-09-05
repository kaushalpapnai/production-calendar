import { useState } from 'react';
import { CalendarHeader } from './components/calendar/CalendarHeader';
import { CalendarGrid } from './components/calendar/CalendarGrid';
import { OrderList } from './components/orderpanel/OrderList';
import { CreateOrderModal } from './components/Modals/CreateOrderModal';

function App() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="h-screen bg-gray-100 overflow-scroll">
      <div className="h-full flex flex-col">
        <CalendarHeader
          onCreateOrder={() => setIsCreateModalOpen(true)}
          onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
        />
        
        <div className="flex-1 flex m-6 h-full">
          <div className="flex-1 overflow-auto">
            <CalendarGrid />
          </div>
          <OrderList />
        </div>
      </div>

      <CreateOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}

export default App;
