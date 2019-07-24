import React from 'react';
import { newContextComponents } from "drizzle-react-components";
import "../index.css";

const { ContractForm } = newContextComponents;

const BankUI = ({ drizzle, drizzleState, approve, create, update }) => (((
    <div>
        <div className="" style={{width: '100%', display: 'inline-block'}}>
            <button type="button" className="float-md-right btn btn-success mt-3 mr-3" onClick={approve}>Approve</button>
        </div>

        <div className="container mt-5">
            <div className="row justify-content-around">
                {/* Form to create a new proposal */}
                <div className="col-sm-4 bg-light">
                    <h2 className="text-info mt-3 text-sm-center">Create Proposals</h2>
                    <form onSubmit={create}>
                        <div className="form-group">
                            <label className="sr-only" htmlFor="type">Choose type...</label>
                            <select id="type" className="form-control" name="Type" required>
                                <option value="">Choose Type...</option>
                                <option value="lending">lending</option>
                                <option value="borrowing">borrowing</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="duration" className="text-secondary">Duration</label>
                            <input type="number" name="Duration" className="form-control" id="duration" placeholder="e.g 1 (in months)" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="interest" className="text-secondary">Interest</label>
                            <input type="number" name="Interest" className="form-control" id="interest" placeholder="e.g 5" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="amount" className="text-secondary">Lending Amount</label>
                            <input type="number" step="any" name="Amount" className="form-control" id="amount" placeholder="Amount of ZST" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="collateral" className="text-secondary">Collateral Amount</label>
                            <input type="number" step="any" name="Collateral" className="form-control" id="collateral" placeholder="Amount of Ether" required/>
                        </div>
                        <div className="mb-3 text-sm-center">
                            <input type="submit" value="Create" className="btn btn-outline-success" />
                        </div>
                    </form>
                </div>

                {/* Form to update an existing proposal */}
                <div className="col-sm-4 bg-light">
                <h2 className="text-info mt-3 text-sm-center">Update Proposals</h2>
                    <form onSubmit={update}>
                        <div className="form-group">
                            <label htmlFor="id" className="sr-only">Proposal Id</label>
                            <input type="number" name="Id" className="form-control" id="id" placeholder="Enter Unique Proposal ID" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="duration" className="text-secondary">New Duration</label>
                            <input type="number" name="Duration" className="form-control" id="duration" placeholder="e.g 1 (in months)" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="interest" className="text-secondary">New Interest</label>
                            <input type="number" name="Interest" className="form-control" id="interest" placeholder="e.g 5" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="amount" className="text-secondary"> New Lending Amount</label>
                            <input type="number" step="any" name="Amount" className="form-control" id="amount" placeholder="Amount of ZST" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="collateral" className="text-secondary"> New Collateral Amount</label>
                            <input type="number" step="any" name="Collateral" className="form-control" id="collateral" placeholder="Amount of Ether" required/>
                        </div>
                        <div className="mb-3 text-sm-center">
                            <input type="submit" value="Update" className="btn btn-outline-success" />
                        </div>
                    </form>
                </div>

                <div className="w-100"></div> <br/>

                {/* Form to pay monthly interest */}
                <div className="col-sm-4 bg-light">
                    <h2 className="text-info mt-3 text-sm-center">Pay Interest</h2>
                    <ContractForm
                        drizzle={drizzle}
                        drizzleState={drizzleState}
                        contract="Bank"
                        method="payInterest"
                        sendArgs={{from: drizzleState.accounts[0]}}
                        render={({ inputs, inputTypes, state, handleInputChange, handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                            {inputs.map((input, index) => (
                                <input
                                key={input.name}
                                type={inputTypes[index]}
                                name={input.name}
                                value={state[input.name]}
                                placeholder={"Enter Unique Proposal ID"}
                                onChange={handleInputChange}
                                className="form-control"
                                required
                                />
                            ))}
                            <div className="text-sm-center">
                                <button
                                    key="submit"
                                    type="button"
                                    onClick={handleSubmit}
                                    className="mb-3 mt-3 btn btn-outline-success"
                                >
                                    Pay Interest
                                </button>
                            </div>
                            </form>

                        )}
                    />
                </div>

                {/* Form to pay final base amount */}
                <div className="col-sm-4 bg-light">
                    <h2 className="text-info mt-3 text-sm-center">Final Payment</h2>
                    <ContractForm
                        drizzle={drizzle}
                        drizzleState={drizzleState}
                        contract="Bank"
                        method="finalPayment"
                        sendArgs={{from: drizzleState.accounts[0]}}
                        render={({ inputs, inputTypes, state, handleInputChange, handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                            {inputs.map((input, index) => (
                                <input
                                key={input.name}
                                type={inputTypes[index]}
                                name={input.name}
                                value={state[input.name]}
                                placeholder={"Enter Unique Proposal ID "}
                                onChange={handleInputChange}
                                className="form-control"
                                required
                                />
                            ))}
                            <div className="text-sm-center">
                            <button
                                key="submit"
                                type="button"
                                onClick={handleSubmit}
                                className="mb-3 mt-3 btn btn-outline-success"
                            >
                                Final Pay
                            </button>
                            </div>
                            </form>

                        )}
                    />
                </div>
            </div>
        </div>

    </div>
)));

export default BankUI;