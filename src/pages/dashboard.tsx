
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleGoDetail = () => {
        navigate('/index');
    }

    return (
        <div className="min-h-screen flex flex-col bg-background p-6 md:p-10">
            <div className="max-w-5xl w-full mx-auto space-y-10">
                <Button className="flex items-center gap-2 mt-20 m-auto" onClick={() => handleGoDetail()}>
                    <ArrowRight className="h-4 w-4" />
                    <span>User Detail</span>
                </Button>
            </div>
        </div>
    );
};

export default Dashboard;
