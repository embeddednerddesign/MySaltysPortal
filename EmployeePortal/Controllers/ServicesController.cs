using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EmployeePortal;
using EmployeePortal.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;

namespace EmployeePortal.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ServicesController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public ServicesController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Services
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Service>>> GetServices()
        {
            var result = await _context.Services.Include(s => s.category)
                .Include(s => s.requiredProducts).ThenInclude(p => p.Product)
                .Include(s => s.recommendedProducts).ThenInclude(p => p.Product)
                .Include(s => s.userCategories).ThenInclude(uc => uc.UserCategory).ToListAsync();

            return result;
        }

        // GET: api/Services/5
        [HttpGet("{id}")]
        public async Task<ActionResult> GetService([FromRoute] int id)
        {
            var service = await _context.Services.Include(s => s.category)
                .Include(s => s.recommendedProducts).ThenInclude(p => p.Product)
                .Include(s => s.requiredProducts).ThenInclude(p => p.Product)
                .Include(s => s.userCategories).ThenInclude(uc => uc.UserCategory).FirstAsync(p => p.ServiceId == id);

            return Ok(service);
        }

        // PUT: api/Services/5
        [HttpPut("{id}")]
        public async Task<ActionResult> PutService([FromRoute] int id, [FromBody] Service service)
        {
            if (id != service.ServiceId)
            {
                return Ok(null);
            }

            var dbEntity = await _context.Services
                .Include(e => e.serviceTaxes)
                .Include(e => e.requiredProducts)
                .Include(e => e.recommendedProducts)
                .Include(e => e.userCategories)
                .FirstAsync(e => e.ServiceId == id);

            foreach (var item in service.serviceTaxes.ToList())
            {
                if (dbEntity.serviceTaxes.Count(p => p.TaxId == item.TaxId) == 0)
                {
                    dbEntity.serviceTaxes.Add(new ServiceTax { ServiceId = item.ServiceId, TaxId = item.TaxId });
                }
            }
            foreach (var item in dbEntity.serviceTaxes.ToList())
            {
                if (service.serviceTaxes.Count(p => p.TaxId == item.TaxId) == 0)
                {
                    dbEntity.serviceTaxes.Remove(item);
                }
            }
            
            foreach (var requiredProduct in service.requiredProducts.ToList())
            {
                if (dbEntity.requiredProducts.Count(p=> p.ProductId == requiredProduct.ProductId) == 0)
                {
                    dbEntity.requiredProducts.Add(requiredProduct);
                }
            }
            foreach (var requiredProduct in dbEntity.requiredProducts.ToList())
            {
                if (service.requiredProducts.Count(p => p.ProductId == requiredProduct.ProductId) == 0)
                {
                    dbEntity.requiredProducts.Remove(requiredProduct);
                }
            }

            foreach (var recommendedProduct in service.recommendedProducts.ToList())
            {
                if (dbEntity.recommendedProducts.Count(p => p.ProductId == recommendedProduct.ProductId) == 0)
                {
                    dbEntity.recommendedProducts.Add(recommendedProduct);
                }
            }
            foreach (var recommendedProduct in dbEntity.recommendedProducts.ToList())
            {
                if (service.recommendedProducts.Count(p => p.ProductId == recommendedProduct.ProductId) == 0)
                {
                    dbEntity.recommendedProducts.Remove(recommendedProduct);
                }
            }

            if (service.userCategories != null)
            {
                foreach (var userCategory in service.userCategories.ToList())
                {
                    if (dbEntity.userCategories.Count(uc => uc.UserCategoryId == userCategory.UserCategoryId) == 0)
                    {
                        dbEntity.userCategories.Add(userCategory);
                    }
                }
                foreach (var userCategory in dbEntity.userCategories.ToList())
                {
                    if (service.userCategories.Count(uc => uc.UserCategoryId == userCategory.UserCategoryId) == 0)
                    {
                        dbEntity.userCategories.Remove(userCategory);
                    }
                }
            }

            // if this doesn't work, try automapper service properties -> dbEntity properties
            dbEntity.serviceName = service.serviceName;
            dbEntity.quantity = service.quantity;
            dbEntity.billingCode = service.billingCode;
            dbEntity.serviceAltName = service.serviceAltName;
            dbEntity.defaultDurationMinutes = service.defaultDurationMinutes;
            dbEntity.subType = service.subType;
            dbEntity.diagnosticCode = service.diagnosticCode;
            dbEntity.serviceIDColour = service.serviceIDColour;
            dbEntity.templateIcon = service.templateIcon;
            dbEntity.defaultPrice = service.defaultPrice;
            dbEntity.status = service.status;
            dbEntity.governmentBilling = service.governmentBilling;
            dbEntity.serviceCategoryId = service.serviceCategoryId;
            dbEntity.serviceTaxes = service.serviceTaxes;
            dbEntity.requiredProducts = service.requiredProducts;
            dbEntity.recommendedProducts = service.recommendedProducts;
            dbEntity.room = service.room;
            dbEntity.equipment = service.equipment;
            dbEntity.userCategories = service.userCategories;
            dbEntity.serviceReqProductsString = service.serviceReqProductsString;
            dbEntity.serviceRecProductsString = service.serviceRecProductsString;

            foreach (var item in dbEntity.serviceTaxes)
            {
                item.Tax = null;
            }

            foreach (var item in dbEntity.requiredProducts)
            {
                item.Product = null;
            }

            foreach (var item in dbEntity.recommendedProducts)
            {
                item.Product = null;
            }

            _context.Services.Update(dbEntity);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ServiceExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(service);
        }

        // POST: api/Services
        [HttpPost]
        public async Task<ActionResult> PostService([FromBody] Service service)
        {
            _context.Services.Add(service);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetService", new { id = service.ServiceId }, service);
        }

        // DELETE: api/Services/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteService([FromRoute] int id)
        {
            var service = await _context.Services.FindAsync(id);
            if (service == null)
            {
                return Ok(null);
            }

            _context.Services.Remove(service);
            await _context.SaveChangesAsync();

            return Ok(service);
        }

        [HttpGet("Category/{id}")]
        public async Task<ActionResult<IEnumerable<Service>>> GetServiceByCategory([FromRoute] int id)
        {
            return await _context.Services.Include(s => s.category)
                .Include(s => s.recommendedProducts).ThenInclude(p => p.Product)
                .Include(s => s.requiredProducts).ThenInclude(p => p.Product)
                .Include(s => s.userCategories).ThenInclude(uc => uc.UserCategory)
                .Where(s => s.serviceCategoryId == id).ToListAsync();
        }

        private bool ServiceExists(int id)
        {
            return _context.Services.Any(e => e.ServiceId == id);
        }

        // GET: api/Services/new
        [HttpGet("new")]
        public async Task<ActionResult> GetListsForNewService()
        {
            var dto = new GetListsForNewServiceDTO
            {
                ServiceCategories = await _context.ServiceCategories.ToListAsync(),
                Products = await _context.Products.ToListAsync(),
                Taxes = await _context.Taxes.ToListAsync()
            };

            return Ok(dto);
        }

        private class GetListsForNewServiceDTO
        {
            public ICollection<ServiceCategory> ServiceCategories { get; set; }
            public ICollection<Product> Products { get; set; }
            public ICollection<Tax> Taxes { get; set; }
        }

        // GET: api/Services/5/edit
        [HttpGet("{id}/edit")]
        public async Task<ActionResult> GetServiceForEdit([FromRoute] int id)
        {
            var list = _context.Services
                .Include(e => e.requiredProducts).ThenInclude(e => e.Product)
                .Include(e => e.recommendedProducts).ThenInclude(e => e.Product)
                .Include(e => e.serviceTaxes).ThenInclude(e => e.Tax)
                .Include(s => s.userCategories).ThenInclude(uc => uc.UserCategory);

            var item = await list.FirstOrDefaultAsync(e => e.ServiceId == id);

            var dto = new GetServiceForEditDTO
            {
                Service = item,
                ServiceCategories = await _context.ServiceCategories.ToListAsync(),
                Products = await _context.Products.ToListAsync(),
                Taxes = await _context.Taxes.ToListAsync()
            };

            return Ok(dto);
        }

        private class GetServiceForEditDTO
        {
            public Service Service { get; set; }
            public ICollection<ServiceCategory> ServiceCategories { get; set; }
            public ICollection<Product> Products { get; set; }
            public ICollection<Tax> Taxes { get; set; }
        }
    }
}