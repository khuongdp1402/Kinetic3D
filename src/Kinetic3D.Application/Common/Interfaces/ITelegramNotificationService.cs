using System.Threading;
using System.Threading.Tasks;
using Kinetic3D.Domain.Entities;

namespace Kinetic3D.Application.Common.Interfaces;

public interface ITelegramNotificationService
{
    Task SendOrderCreatedNotificationAsync(Order order, CancellationToken cancellationToken = default);
    Task SendPaymentSuccessNotificationAsync(Order order, decimal paidAmount, string transactionRef, CancellationToken cancellationToken = default);
    Task<bool> SendTestMessageAsync(string customMessage, CancellationToken cancellationToken = default);
}
