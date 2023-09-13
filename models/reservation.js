module.exports = (sequelize, Sequelize) => {
    const Reservation = sequelize.define('Reservation', {
        StartDate: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true,
            validate: {
                isValidStartDate(value) {
                    if (!this.EndDate && !value) {
                        throw new Error('Both StartDate and EndDate must be provided');
                    }
                    if (!value) {
                        return;
                    }
                    if (this.EndDate && value >= this.EndDate) {
                        throw new Error('StartDate must be before EndDate');
                    }
                    if (value <= new Date()) {
                        throw new Error('StartDate must be after the current date');
                    }
                }
            }
        },
        EndDate: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true,
            validate: {
                isValidEndDate(value) {
                    if (!this.StartDate && !value) {
                        throw new Error('Both StartDate and EndDate must be provided');
                    }
                    if (!value) {
                        return;
                    }
                    if (this.StartDate && value <= this.StartDate) {
                        throw new Error('EndDate must be after StartDate');
                    }
                    if (value <= new Date()) {
                        throw new Error('EndDate must be after the current date');
                    }
                }
            }
        }
    }, {
        timestamps: false,
        hasTrigger: true
    });

    return Reservation;
}
