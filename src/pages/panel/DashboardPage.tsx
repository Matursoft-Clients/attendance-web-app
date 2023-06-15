import { Outlet } from "react-router-dom";

export default function DashboardPage() {

    return (
        <div>
            <div className="page-header">
                <div className="page-block">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <div className="page-header-title">
                                <h5 className="m-b-10">Dashboard</h5>
                            </div>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">Dashboard</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <h3 className='mb-3'>Dashboard</h3>
                </div>
            </div>

            <div className="row">
                <div className="col-md-3">
                    <div className="card prod-p-card background-pattern">
                        <div className="card-body">
                            <div className="row align-items-center m-b-0">
                                <div className="col">
                                    <h6 className="m-b-5">Total Profit</h6>
                                    <h3 className="m-b-0">$1,783</h3>
                                </div>
                                <div className="col-auto">
                                    <i className="fas fa-money-bill-alt text-primary"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card prod-p-card bg-primary background-pattern-white">
                        <div className="card-body">
                            <div className="row align-items-center m-b-0">
                                <div className="col">
                                    <h6 className="m-b-5 text-white">Average Price</h6>
                                    <h3 className="m-b-0 text-white">$6,780</h3>
                                </div>
                                <div className="col-auto">
                                    <i className="fas fa-dollar-sign text-white"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card prod-p-card background-pattern">
                        <div className="card-body">
                            <div className="row align-items-center m-b-0">
                                <div className="col">
                                    <h6 className="m-b-5">Product Sold</h6>
                                    <h3 className="m-b-0">6,784</h3>
                                </div>
                                <div className="col-auto">
                                    <i className="fas fa-tags text-primary"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card prod-p-card bg-primary background-pattern-white">
                        <div className="card-body">
                            <div className="row align-items-center m-b-0">
                                <div className="col">
                                    <h6 className="m-b-5 text-white">Total Orders</h6>
                                    <h3 className="m-b-0 text-white">15,830</h3>
                                </div>
                                <div className="col-auto">
                                    <i className="fas fa-database text-white"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <div className="card">
                        <div className="card-body">
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure nostrum praesentium illo repellendus! Temporibus eligendi hic sequi amet aspernatur voluptatum officiis enim sint quod. Consectetur vel commodi accusantium tempora aperiam.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}